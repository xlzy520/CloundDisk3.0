<template>
  <div id="placeholder"></div>
</template>

<script>
  import fileService from '@/api/service/file';
  import dynamicLoadScripts from '@/utils/dynamicLoadScript';
  export default {
    name: 'office',
    data() {
      return {
        id: '',
        vid: '',
        data: {},
        historyData: {
          key: '1000001422884397',
          url: 'http://192.168.12.23:8081/djcpsdocument/fileManager/downloadFile.do?id=1000001422884397',
          version: 1
        }
      };
    },
    created() {
      dynamicLoadScripts('http://192.168.23.170:32916/web-apps/apps/api/documents/api.js').then(() => {
        this.getOfficeData().then(() => {
          const onRequestHistoryClose = function() {
            document.location.reload();
          };
          const onRequestHistoryData = (event) => {
            var version = event.data;
            this.historyData = this.data.historys[version - 1];
            this.historyData.version = version;
            window.docEditor.setHistoryData(this.data.historys[version - 1]);
          };
          const onRequestHistory = () => {
            window.docEditor.refreshHistory({
              currentVersion: 1,
              history: this.data.historys
            });
          };
          const config = {
            ...this.data,
            events: {
              'onRequestHistory': onRequestHistory,
              'onRequestHistoryData': onRequestHistoryData,
              'onRequestHistoryClose': onRequestHistoryClose
            },
            'height': '100%',
            'width': '100%'
          };
          window.docEditor = new window.DocsAPI.DocEditor('placeholder', config);
        });
      });
    },
    methods: {
      async getOfficeData() {
        try {
          const res = await fileService.getOffice(this.$route.query);
          if (res && res.success) {
            this.data = res.data;
            this.data.historys.map((item) => {
              item.user = {};
              item.user.name = item.updator;
            });
          }
        } catch (err) {
          this.$message1000(err.msg, 'error');
          setTimeout(() => {
            window.close();
          }, 300);
        }
      }
    },
    mounted() {

    }
  };
</script>

<style lang="scss" scoped>
  #placeholder{
    height: 400px;
    margin:0;
  }
</style>
