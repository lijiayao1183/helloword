import {mapGetters} from 'vuex'

const Loading = {
  computed: {
    ...mapGetters({
      loading: 'loading'
    })
  }
}
export default Loading
