import fileTypeConfig from './fileTypeConfig.json';

export function getZipTree(zip) {
  let tree = { name: 'root', children: [] };
  let nodePointers = [tree];
  for (let key of Object.keys(zip.files)) {
    let node = zip.files[key];
    for (let i = nodePointers.length - 1; i >= 0; i--) {
      let simpleName = node.name.split('/').filter(item => item).pop();
      Object.assign(node, {
        simpleName: simpleName,
        type: simpleName.split('.')[1]
      });
      getFileType(node);
      if (node.name.includes(nodePointers[nodePointers.length - 1].name) || nodePointers.length === 1) {
        nodePointers[nodePointers.length - 1].children.push(node);
        if (node.dir) {
          nodePointers.push(Object.assign(node, {children: []}));
        }
        break;
      } else {
        nodePointers.pop();
      }
    }
  }
  return tree;
}

function getFileType(file) {
  if (file.dir) {
    file.fileType = "1";
  } else if (fileTypeConfig[file.type]) {
    file.fileType = fileTypeConfig[file.type].value;
  } else {
    file.fileType = "0";
  }
}
