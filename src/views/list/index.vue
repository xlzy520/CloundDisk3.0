<template>
  <div>
    <div class="hd">
      <div class="action-wrap">
        <div class="action-item">
          <svg-icon icon-class="list" className="icon" />
        </div>
        <div class="action-item">
          <svg-icon icon-class="list2" className="icon" />
        </div>
      </div>
    </div>
    <div class="list">
      <ul>
        <li v-for="(item, index) in list" :key="index">
          <div :class="['box', item.checked ? 'box-hover' : '']">
            <el-checkbox v-model="item.checked"></el-checkbox>
            <a href="#">
              <svg-icon :icon-class="item.type ? 'folder' : 'file-markdown-fill'" className="icon" />
            </a>
            <h3><a href="#">文件夹</a></h3>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  data() {
    return {
      list: [
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 0, checked: false },
        { type: 0, checked: false },
        { type: 0, checked: false }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.hd {
  .action-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    padding-right: 80px;
    .action-item {
      .icon {
        width: 32px;
        height: 32px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
}
.list {
  width: 92%;
  margin: 20px auto;
  justify-content: center;
  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    text-align: center;
    li {
      width: 115px;
      height: 150px;
      margin: 0 10px;
      .box-hover {
        background: #F4F4F4;
        .el-checkbox {
          display: block!important;
        }
      }
      .box {
        position: absolute;
        &:hover {
          background: #F4F4F4;
          .el-checkbox {
            display: block;
          }
        }
        .el-checkbox {
          display: none;
          position: absolute;
          right: 6px;
          top: 6px;
        }
        h3 {
          overflow:hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
        }
        .icon {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
}
</style>
