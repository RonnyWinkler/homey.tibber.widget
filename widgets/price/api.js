'use strict';

module.exports = {

  async getHomeDeviceData({ homey, query }) {
    return await homey.app.tibberAppApi.get('/home-device-data?deviceId='+query.deviceId, {});
  }
};