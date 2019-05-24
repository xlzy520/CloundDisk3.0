import fileService from '@/api/service/file';
import JSZip from 'jszip';
import { getZipTree } from '../utils/getZipTree.js';

const fileType = {
  data() {
    return {
      fullLoading: false
    };
  },
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
        case 1: //FOLDER(文件夹)
        case "1":
          this.$router.push({path: '/index/list', query: {dirid: fcategoryid}});
          break;
        case 2:case 9:case 11: //Text、Markdown
          this.$emit('action', 'openMD', {fcategoryid, fversionsign, fname});
          break;
        case 3:case 4:case 5: //office
          window.open(`/#/office?id=${fcategoryid}&vid=${fversionsign}`);
          break;
        case 6: //PDF
          window.open(`/djcpsdocument/fileManager/previewPdf.do?id=${fcategoryid}`);
          break;
        case 7: //IMG
          if (parseInt(fsize) > (1024 * 1024 * 10)) {
            this.$message1000('图片大小超过10M,无法预览', 'error');
          } else {
            this.$emit('action', 'viewImg', {
              url: `/djcpsdocument/fileManager/downloadFile.do?id=${fcategoryid}`,
              name: fname
            });
          }
          break;
        case 8: //XMind
          window.sessionStorage.setItem('xmindName', fname);
          window.sessionStorage.setItem('xmindID', fcategoryid);
          window.open('/xmind/edit.html');
          break;
        case 10: //zip
          this.fullLoading = true;
          fileService.downloadFile(fcategoryid, 'blob').then(res => {
            let zip = new JSZip();
            zip.loadAsync(res).then(_zip => {
              let tree = getZipTree(_zip);
              this.$emit('action', 'zipReader', {
                ...tree,
                fname: row.fname,
                _zip
              });
            });
          }).finally(()=>{
            this.fullLoading = false;
          });
          break;
        case 12: //rp
          this.fullLoading = true;
          fileService.previewRpDocument(fcategoryid).then(res => {
            if (res.success) {
              window.open(res.data.previewUrl, "_blank");
            } else {
              this.$message1000(res.msg, 'error');
            }
          }).finally(()=>{
            this.fullLoading = false;
          });
          break;
        default:
          break;
      }
    }
  }
};
export default fileType;
