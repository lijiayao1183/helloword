import { mapGetters, mapActions } from 'vuex'
const mixin = {
  methods: {
    ...mapActions([
      'hideLoading'
    ])
  },
  computed: {
    ...mapGetters({
      loading: 'loading'
    })
  }
}
export default mixin
