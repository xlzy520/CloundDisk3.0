<template>
  <div id="placeholder" style="height: 400px; margin:0;"></div>
</template>

<script>
  import { getOffice } from '@/api/office'
  export default {
    name: 'office',
    data() {
      return {
        id: '',
        vid: '',
        document: {},
        editConfig: {},
        history: [],
        historyData: {
          key: '1000001422884397',
          url: 'http://192.168.12.23:8081/djcpsdocument/fileManager/downloadFile.do?id=1000001422884397',
          version: 1
        }
      }
    },
    created() {
      const script = document.createElement('script')
      const head = document.getElementsByTagName('head')[0]
      script.type = 'text/javascript'
      script.charset = 'UTF-8'
      script.async = 'defer'
      script.src = 'http://192.168.12.228:9000/web-apps/apps/api/documents/api.js'
      head.appendChild(script)
      getOffice(this.$route.query).then((res) => {
        console.log(res)
        const history = res.data.historys
        history.map((item) => {
          item.user = {}
          item.user.name = item.updator
        })
        console.log(history)
        this.history = history
        this.document = res.data.document
        this.editConfig = res.data.editConfig
      })
    },
    methods: {

    },
    mounted() {
      const onRequestHistoryClose = function() {
        document.location.reload()
      }
      const onRequestHistoryData = (event) => {
        var version = event.data
        this.historyData.version = version
        this.historyData = this.history[version - 1]
        window.docEditor.setHistoryData(this.historyData)
      }
      const onRequestHistory = () => {
        window.docEditor.refreshHistory({
          currentVersion: this.history.length,
          history: this.history
        })
      }
      setTimeout(() => {
        console.log(this.editConfig);
        window.docEditor = new window.DocsAPI.DocEditor('placeholder', {
          document: this.document,
          events: {
            'onRequestHistory': onRequestHistory,
            'onRequestHistoryData': onRequestHistoryData,
            'onRequestHistoryClose': onRequestHistoryClose
          },
          'documentType': 'text',
          // 编辑参数
          'editorConfig': this.editConfig,
          'height': '100%',
          'width': '100%'
        })
      }, 1000)
    }
  }
</script>

<style scoped>

</style>
