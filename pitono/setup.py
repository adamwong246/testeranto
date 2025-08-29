from setuptools import setup, find_packages
import os

# Get the long description from the README file
readme_path = os.path.join(os.path.dirname(__file__), 'README.md')
long_description = ''
if os.path.exists(readme_path):
    with open(readme_path, 'r', encoding='utf-8') as f:
        long_description = f.read()

setup(
    name="pitono",
    version="0.1.0",
    packages=find_packages(where='.'),
    package_dir={'': '.'},
    entry_points={
        'console_scripts': [
            'pitono-core-generator=core_generator:main',
        ],
    },
    python_requires='>=3.7',
    install_requires=[
        # Add any dependencies here
    ],
    author="Testeranto Team",
    author_email="",
    description="Python implementation of Testeranto",
    long_description=long_description,
    long_description_content_type="text/markdown",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
)
