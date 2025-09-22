// export const ArtifactTree = ({
//   treeData,
//   projectName,
//   testName,
//   runtime,
//   onSelect,
//   level = 0,
//   basePath = ''
// }: {
//   treeData: Record<string, any>;
//   projectName: string;
//   testName: string;
//   runtime: string;
//   onSelect: (path: string) => void;
//   level?: number;
//   basePath?: string;
// }) => {
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});

//   const toggleExpand = (path: string) => {
//     setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <ul className="list-unstyled" style={{ paddingLeft: `${level * 16}px` }}>
//       {Object.entries(treeData).map(([name, node]) => {
//         const fullPath = basePath ? `${basePath}/${name}` : name;
//         const isExpanded = expanded[fullPath];

//         if (node.__isFile) {
//           return (
//             <li key={fullPath} className="py-1">
//               <a
//                 href={`reports/${projectName}/${testName
//                   .split('.')
//                   .slice(0, -1)
//                   .join('.')}/${runtime}/${node.path}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-decoration-none"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   onSelect(node.path);
//                 }}
//               >
//                 <i className="bi bi-file-earmark-text me-2"></i>
//                 {name}
//               </a>
//             </li>
//           );
//         } else {
//           return (
//             <li key={fullPath} className="py-1">
//               <div className="d-flex align-items-center">
//                 <button
//                   className="btn btn-link text-start p-0 text-decoration-none me-1"
//                   onClick={() => toggleExpand(fullPath)}
//                 >
//                   <i
//                     className={`bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-2`}
//                   ></i>
//                   {name}
//                 </button>
//               </div>
//               {isExpanded && (
//                 <ArtifactTree
//                   treeData={node}
//                   projectName={projectName}
//                   testName={testName}
//                   runtime={runtime}
//                   onSelect={onSelect}
//                   level={level + 1}
//                   basePath={fullPath}
//                 />
//               )}
//             </li>
//           );
//         }
//       })}
//     </ul>
//   );
// };