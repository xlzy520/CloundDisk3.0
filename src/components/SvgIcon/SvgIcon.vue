<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
  import table from './svgIconTable';
export default {
  name: 'svg-icon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconName() {
      if (!Number(this.iconClass) < 0) {
        return `#icon-${table[this.iconClass]}`;
      }
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className;
      } else {
        return 'svg-icon';
      }
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 2em;
  height: 2em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
