const fileType = {
  methods: {
    fileType(row, event) {
      if (event) event.stopPropagation(); //防止点击文件名之后选择该文件,render方式,Vue使用.stop
      let {ffiletype, fcategoryid, fversionsign, fsize, fname, fvsgin, filesgin} = row;
      if (ffiletype === undefined) { //在版本列表组件中，没有文件类型
        ffiletype = this.selectedData[0].ffiletype;
        fname = this.selectedData[0].fname;
      }
      if (fvsgin !== undefined) { //在版本列表组件中，字段名不一样
        fcategoryid = filesgin;
        fversionsign = fvsgin;
      }
      switch (ffiletype) {
        case 1: //FOLDER
          this.$emit('open-dir', fcategoryid);
          this.$router.push({path: '/index/list', query: {dirid: fcategoryid}});
          break;
        case 2:
        case 9: //Text、Markdown
          this.$emit('md', {fcategoryid, fversionsign});
          break;
        case 3:
        case 4:
        case 5: //office
          window.open(`/#/office?id=${fcategoryid}&vid=${fversionsign}`);
          break;
        case 6: //PDF
          window.open(`/djcpsdocument/fileManager/previewPdf.do?id=${fcategoryid}`);
          break;
        case 7: //IMG
          if (parseInt(fsize) > (1024 * 1024 * 10)) {
            this.$message1000('图片大小超过10M,无法预览', 'error');
          } else {
            this.$emit('viewImg', fcategoryid);
          }
          break;
        case 8: //XMind
          window.sessionStorage.setItem('xmindName', fname);
          window.sessionStorage.setItem('xmindID', fcategoryid);
          window.open(`/static/xmind/edit.html`);
          break;
        case 10: //ZIP,RAR
          console.log('预览压缩包');
          break;
        case 11: //code
          console.log('代码编辑器');
          break;
        default:
          break;
      }
    }
  }
};
export default fileType;
