import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Set desired value here
      responseLimit: false,
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;
      const response = await axios.post(
        `https://node-api.datasphere.yandexcloud.net/process_image`,
        {
          image,
          positive_prompt:
            'uniformly blended area, natural and homogeneous background with few details, with open space in center. Realism, no sharp details.',
          negative_prompt:
            'ugly, deform, distort, disfigured, disgusting, objects, entities, people',
          inpaint_additional_prompt: ' ',
          inpaint_negative: 'Object modification, people, artifacts.',
          kernel_size: 40,
          use_kernel: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
            'x-node-id': `${process.env.X_NODE_ID}`,
            'x-folder-id': `${process.env.X_FOLDER_ID}`,
            'Content-Type': 'application/json',
            Accept: '*/*',
            Connection: 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            Origin: '*',
          },
        }
      );
      console.log(response);
      res.json(response.data);
    } catch (error: any) {
      console.log(error);
      res
        .status(error.response?.status || 500)
        .send(`HTTP error! status: ${error.response?.status || error.message}`);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
