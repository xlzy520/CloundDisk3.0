<template>
  <div class="right-menu" @click="click">
    <ul class="right-menu-button">
      <li v-for="item in config" :class="{ disabled: !actionArray.find(ket => ket === item.value) }" :data-action="item.value">{{ item.label }}</li>
    </ul>
  </div>
</template>

<script>
  import config from '../listHeaderConfig.js';
  import { mapGetters } from 'vuex';

  export default {
    name: 'right-menu',
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
  .right-menu {
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
