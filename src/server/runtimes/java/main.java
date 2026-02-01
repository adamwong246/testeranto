import java.io.*;
import java.nio.file.*;
import java.security.*;
import java.util.*;
import org.json.*;

public class main {
    public static void main(String[] args) throws Exception {
        System.out.println("🚀 Java builder starting...");
        
        // Get test name from environment
        String testName = System.getenv("TEST_NAME");
        if (testName == null || testName.isEmpty()) {
            testName = "allTests";
        }
        System.out.println("TEST_NAME=" + testName);
        
        // Load configuration
        String configPath = findConfig();
        System.out.println("Config path: " + configPath);
        
        if (configPath == null || !Files.exists(Paths.get(configPath))) {
            System.err.println("❌ Config file not found");
            System.exit(1);
        }
        
        // Read and parse config
        String configContent = new String(Files.readAllBytes(Paths.get(configPath)));
        JSONObject config = new JSONObject(configContent);
        
        // Get Java tests
        JSONObject javaConfig = config.optJSONObject("java");
        if (javaConfig == null) {
            System.out.println("No Java tests found in config");
            return;
        }
        
        JSONObject tests = javaConfig.optJSONObject("tests");
        if (tests == null) {
            System.out.println("No tests in Java config");
            return;
        }
        
        System.out.println("✅ Loaded config with " + tests.length() + " Java test(s)");
        
        // Process each test
        for (String testKey : tests.keySet()) {
            System.out.println("\n📦 Processing test: " + testKey);
            JSONObject testConfig = tests.getJSONObject(testKey);
            String testPath = testConfig.getString("path");
            
            // Get test file name and base name
            Path testFilePath = Paths.get(testPath);
            String testFileName = testFilePath.getFileName().toString();
            String testBaseName = testFileName.replaceFirst("[.][^.]+$", "");
            
            // Collect input files
            List<String> inputFiles = collectInputFiles(testPath);
            
            // Compute hash
            String testHash = computeFilesHash(inputFiles);
            
            // Create artifacts directory
            Path artifactsDir = Paths.get("/workspace", "testeranto/bundles/allTests/java", "example");
            Files.createDirectories(artifactsDir);
            
            // Create inputFiles.json
            Path inputFilesPath = artifactsDir.resolve(testBaseName + ".java-inputFiles.json");
            JSONArray inputFilesArray = new JSONArray();
            for (String file : inputFiles) {
                inputFilesArray.put(file);
            }
            Files.write(inputFilesPath, inputFilesArray.toString(2).getBytes());
            
            System.out.println("  ✅ Created inputFiles.json at " + inputFilesPath + " (hash: " + testHash + ")");
            
            // Compile the test
            Path outputJarPath = artifactsDir.resolve(testBaseName + ".jar");
            System.out.println("  🔨 Compiling test to " + outputJarPath + "...");
            
            // For now, just create a placeholder
            // In a real implementation, we would compile with javac and package with jar
            createPlaceholderJar(outputJarPath, testPath);
            
            System.out.println("  ✅ Successfully created placeholder JAR");
        }
        
        System.out.println("\n🎉 Java builder completed successfully");
    }
    
    private static String findConfig() {
        return "/workspace/testeranto/runtimes/java/java.json";
    }
    
    private static List<String> collectInputFiles(String testPath) {
        List<String> files = new ArrayList<>();
        
        // Add the test file itself
        files.add(testPath);
        
        // Look for Java files in the same directory
        Path testDir = Paths.get(testPath).getParent();
        if (testDir != null && Files.exists(testDir)) {
            try {
                Files.walk(testDir)
                    .filter(path -> path.toString().endsWith(".java"))
                    .forEach(path -> {
                        String relativePath = "/workspace".equals(path.toString().substring(0, Math.min(path.toString().length(), 9))) 
                            ? path.toString().substring(10) // Remove /workspace/
                            : path.toString();
                        if (!files.contains(relativePath)) {
                            files.add(relativePath);
                        }
                    });
            } catch (IOException e) {
                System.err.println("Warning: Could not walk directory: " + e.getMessage());
            }
        }
        
        // Add pom.xml or build.gradle if present
        Path workspace = Paths.get("/workspace");
        if (Files.exists(workspace.resolve("pom.xml"))) {
            files.add("pom.xml");
        }
        if (Files.exists(workspace.resolve("build.gradle"))) {
            files.add("build.gradle");
        }
        if (Files.exists(workspace.resolve("build.gradle.kts"))) {
            files.add("build.gradle.kts");
        }
        
        return files;
    }
    
    private static String computeFilesHash(List<String> files) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            for (String file : files) {
                Path filePath = Paths.get("/workspace", file);
                md.update(file.getBytes());
                if (Files.exists(filePath)) {
                    FileTime lastModified = Files.getLastModifiedTime(filePath);
                    long size = Files.size(filePath);
                    md.update(Long.toString(lastModified.toMillis()).getBytes());
                    md.update(Long.toString(size).getBytes());
                } else {
                    md.update("missing".getBytes());
                }
            }
            byte[] digest = md.digest();
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return "error";
        }
    }
    
    private static void createPlaceholderJar(Path jarPath, String testPath) throws IOException {
        // Create a simple manifest
        String manifest = "Manifest-Version: 1.0\nMain-Class: TestRunner\n";
        
        // Create a simple test runner
        String testRunner = 
            "public class TestRunner {\n" +
            "    public static void main(String[] args) {\n" +
            "        System.out.println(\"Java test runner for: " + testPath + "\");\n" +
            "        System.out.println(\"This is a placeholder implementation.\");\n" +
            "    }\n" +
            "}\n";
        
        // Create a temporary directory
        Path tempDir = Files.createTempDirectory("java-builder");
        try {
            // Write manifest
            Path metaInfDir = tempDir.resolve("META-INF");
            Files.createDirectories(metaInfDir);
            Files.write(metaInfDir.resolve("MANIFEST.MF"), manifest.getBytes());
            
            // Write test runner
            Files.write(tempDir.resolve("TestRunner.java"), testRunner.getBytes());
            
            // Create JAR file
            List<String> jarCommand = Arrays.asList(
                "jar", "cfm", jarPath.toString(),
                metaInfDir.resolve("MANIFEST.MF").toString(),
                "-C", tempDir.toString(), "."
            );
            
            ProcessBuilder pb = new ProcessBuilder(jarCommand);
            Process process = pb.start();
            int exitCode = process.waitFor();
            
            if (exitCode != 0) {
                System.err.println("Warning: jar command failed with exit code " + exitCode);
                // Create a minimal JAR anyway
                Files.write(jarPath, "Placeholder JAR".getBytes());
            }
        } finally {
            // Clean up
            Files.walk(tempDir)
                .sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);
        }
    }
}
