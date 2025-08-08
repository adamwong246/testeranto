export const buildTree = (features) => {
    const tree = {};
    features.forEach(({ name, status }) => {
        const parts = name.split(" - ");
        const projectAndTest = parts.slice(0, 2).join(" - ");
        const givenAndThen = parts.slice(2).join(" - ");
        const pathParts = projectAndTest.split("/");
        let current = tree;
        pathParts.forEach((part) => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });
        current[givenAndThen] = status;
    });
    return tree;
};
// export const renderTree = (nodes: any) => (
//   <ul>
//     {Object.entries(nodes).map(([key, value]) => (
//       <li key={key}>
//         {typeof value === 'string' ? (
//           <span>{key} - {value}</span>
//         ) : (
//           <>
//             <span>{key}</span>
//             {renderTree(value)}
//           </>
//         )}
//       </li>
//     ))}
//   </ul>
// );
