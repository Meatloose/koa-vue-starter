import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    Loading: 'Loading',
    Popup: 'Popup'
  }),

  methods: mapActions([
    'showPopup',
    'showLoading',
    'hideLoading'
  ])
}
