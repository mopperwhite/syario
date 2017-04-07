<template lang="jade">
video
</template>
<script>
import QCodeDecoder from 'qcode-decoder/build/qcode-decoder.min.js'
const qr = new QCodeDecoder();
export default {
  mounted(){
    console.log(this.$el)
    qr.decodeFromCamera(this.$el,
      (err, result) => {
        if (err) throw err;
        alert(result);
      })
  },
  breforeDestroyed(){
    qr.stop()
  }
}
</script>
