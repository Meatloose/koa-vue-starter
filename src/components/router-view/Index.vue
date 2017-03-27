<template lang="jade">
main#app
  keep-alive
    router-view
  loading(v-if="Loading.SHOW", :options="Loading.OPTIONS")
  popup(v-if="Popup.SHOW", :options="Popup.OPTIONS")
</template>

<script>
import Loading from 'components/common/Loading'
import Popup from 'components/common/Popup'
import { mapState } from 'vuex'

export default {
  components: {
    Loading,
    Popup
  },

  computed: mapState(['Loading', 'Popup'])
}
</script>
