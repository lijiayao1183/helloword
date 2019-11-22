export default {
  methods: {
    getValueScopeOption(valueScope) {
      let option = [];
      if (!_.isEmpty(valueScope)) {
        _.forEach(_.split(valueScope, /[,|，]/), item => {
          let temp = _.split(item, /[:|：]/);
          if (temp.length === 2) {
            option.push({
              label: temp[0],
              value: temp[1]
            });
          }
        })
      }
      return option;
    }
  }
}
