<template lang='jade'>
div.container.msgbox.alert(:class="alert_style")
  div.row
    span.col-md-10.text_style
      | {{msg}}
    button.col-md-2.close.close-btn(
      @click="$emit('close')",
      type="button",
      aria-label="Close")
      span(aria-hidden="true")
        i.glyphicon.glyphicon-remove
</template>
<script>
export default {
  props: ['msg', 'type'],
  computed: {
    bg_style () {
      return {
        error: 'bg-danger',
        warn: 'bg-warning',
        info: 'bg-info',
      }[this.type]
    },
    text_style () {
      return {
        error: 'text-danger',
        warn: 'text-warning',
        info: 'text-info',
      }[this.type]
    },
    alert_style () {
      return {
        error: 'alert-danger',
        warn: 'alert-warning',
        info: 'alert-info',
      }[this.type]
    }
  }
}
</script>
<style scoped>
.msgbox{
  width: 100%;
  padding: 0.5em;
  font-size: 2.5em;
}
.close-btn{
  font-size: 1.5em;
}
</style>
