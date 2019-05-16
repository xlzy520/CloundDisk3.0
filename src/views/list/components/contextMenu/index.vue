<template>
  <div class="context-menu" @click="click">
    <ul class="context-menu-button">
      <li v-for="item in config"
          :key="item.value"
          :class="{ disabled: actionArray.findIndex(key => key === item.value)<0 }"
          :data-action="item.value">{{ item.label }}</li>
    </ul>
  </div>
</template>

<script>
  import config from '../ListHeaderConfig.js';
  import { mapGetters } from 'vuex';

  export default {
    name: 'ContextMenu',
    data () {
      return {
        config: config
      };
    },
    computed: {
      ...mapGetters([
        'actionArray'
      ]),
    },
    methods: {
      click({ target }) {
        const action = target.getAttribute('data-action') ||
          target.parentElement.getAttribute('data-action') ||
          target.parentElement.parentElement.getAttribute('data-action');
        if (action) {
          this.$emit('action', action);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .context-menu {
    &-button {
      list-style: none;
      background: #fbfcff;
      line-height: 30px;
      width: 100px;
      text-align: center;
      border-radius: 4px;
      box-shadow: 0 2px 5px #a9a7a7;
      color: #000000;
      // position: fixed;
      z-index: 200;
      li {
        cursor: pointer;
        &:hover {
          background: rgba(10,193,41,.8);
          color: #fff;
        }
      }
      .disabled {
        color: #bbbbbb;
        pointer-events: none;
      }
    }
  }
</style>
