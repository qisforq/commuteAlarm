import axios from 'axios';

module.exports = {
  getCommuteData: (userId, that) => {
    axios.get('http://localhost:8082/commutetime', {
      params: {
        userId: userId
      }
    })
    .then((alarmCommuteData) => {
      that.setState({
        alarmCommuteData: alarmCommuteData
      });
    }).catch((err) => {
      console.log('Error in axios.get(/commutetime)',err);
    })
  },
  test: () => {
    console.log('THIS IS A TEST');
  }
}
