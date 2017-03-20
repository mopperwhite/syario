<template lang='jade'>
div
  span(@click="$emit('close')")
    | {{msg}}
</template>
<script>
export default {
  props: ['msg', 'type']
}
</script>
