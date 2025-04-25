'use strict';

module.exports = {

  async getHomeDeviceData({ homey, query }) {
    try{
      let result =await homey.app.tibberAppApi.get('/home-device-data?deviceId='+query.deviceId, {});
      return result;
    } catch (error) {
      throw new Error('Missing Tibber app version 1.10.0 or higher');
    }
  }
};