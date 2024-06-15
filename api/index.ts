//@ts-nocheck
import axios from 'axios';
import { ApiResponse } from '@/types';

export const getBackground = async (imgString: string) => {
  try {
    // const response = await axios.post(
    //   'https://node-api.datasphere.yandexcloud.net/process_image',
    //   {
    //     image: imgString.replace('data:image/png;base64', ''),
    //     positive_prompt:
    //       'a background that does not attract much attention, in which the object is clearly visible',
    //     negative_prompt: 'new objects or entities',  
    //     kernel_size: 30,
    //     use_kernel: 1
    //   },
    //   {
    //     headers: {
    //       Authorization:
    //         'Bearer t1.9euelZrGyYrKmIrIzoubk8bPnJTPie3rnpWaycfMjY2bjceZko_OlImay83l8_cHaEtM-e9HRwU4_t3z90cWSUz570dHBTj-zef1656VmpCMmY-LmZyPkYmZiZSXjJaS7_zF656VmpCMmY-LmZyPkYmZiZSXjJaS.8rUJICqRElXI-aHqPYudaMDUiI4Bh_tQuKiIfjGtJiWGyAXUls8WerDo-i4lsuLryOfnj3x8rgnPIu7pVs-2Cg',
    //       'x-node-id': 'bt1c2ledfbhjs72hpen8',
    //       'x-folder-id': 'b1ghpjs6kvfc7th9878i',
    //       'Content-Type': 'application/json',
    //       Accept: '*/*',
    //       Connection: 'keep-alive',
    //       'Access-Control-Allow-Origin': '*',
    //       Origin: '*',
    //     },
    //   }
    // );
      const response = await axios.post(
      'http:localhost:30001/process_image',
      {
        // image: imgString.replace('data:image/png;base64,', ''),
        // positive_prompt:
        //   'a background that does not attract much attention, in which the object is clearly visible',
        // negative_prompt: 'new objects or entities',  
        // kernel_size: 30,
        // use_kernel: 1
      },
      {  headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          Origin: '*',
        },}
      // {
      //   headers: {
      //     Authorization:
      //       'Bearer t1.9euelZrGyYrKmIrIzoubk8bPnJTPie3rnpWaycfMjY2bjceZko_OlImay83l8_cHaEtM-e9HRwU4_t3z90cWSUz570dHBTj-zef1656VmpCMmY-LmZyPkYmZiZSXjJaS7_zF656VmpCMmY-LmZyPkYmZiZSXjJaS.8rUJICqRElXI-aHqPYudaMDUiI4Bh_tQuKiIfjGtJiWGyAXUls8WerDo-i4lsuLryOfnj3x8rgnPIu7pVs-2Cg',
      //     'x-node-id': 'bt1c2ledfbhjs72hpen8',
      //     'x-folder-id': 'b1ghpjs6kvfc7th9878i',
      //     'Content-Type': 'application/json',
      //     Accept: '*/*',
      //     Connection: 'keep-alive',
      //     'Access-Control-Allow-Origin': '*',
      //     Origin: '*',
      //   },
      // }
    );

    const result: ApiResponse = response.data;
    return result;
  } catch (error) {
    throw new Error(`HTTP error! status: ${error.response?.status || error.message}`);
  }
};
