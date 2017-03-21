<template lang='jade'>
div.msgbox
  span(@click="$emit('close')", :class="text_style")
    | {{msg}}
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
  }
}
</script>
<style scoped>
.msgbox{
  width: 100%;
  padding: 2em;
}
</style>
