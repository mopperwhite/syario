<template lang="jade">
div.container.navi-btn-group
  div.btn-group.row.navi-btn-group
    router-link.btn.col-md-6.col-xs-6.nav-btn.btn-lg.btn-link(
        :class="{disabled: !priv_path}",
        :to='"/file" + priv_path')
      span.glyphicon.glyphicon-chevron-left
    router-link.btn.col-md-6.col-xs-6.nav-btn.btn-lg.btn-link(
        :class="{disabled: !next_path}"
        @click='goto_path("/file" + next_path)',
        :to='"/file" + next_path')
      span.glyphicon.glyphicon-chevron-right
</template>
<script>
export default {
  props: ['priv_path', 'next_path']
}
</script>
<style scoped>
.navi-btn-group {
  width: 100%;
  margin: 0;
}
</style>
