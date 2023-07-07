const express = require('express');
const router = express.Router();
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();
const upload = require('../models/model');

router.get('/', (req, res) => {
    res.send('hello world')
})

// define registration route
router.post('/', (req, res) => {
    const {username, password} = req.body;
    res.send('register')
})

// define login route with bcrypt encryption
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    res.send('login successfully')
})

// define logout route
router.post('/logout', (req, res) => {
    res.send('logout')
})
if(!process.env.apiKey) throw new Error('Missing Stability API Key.');
// add api for generative image from text
router.post('/generative-image',async (req,res) => {
    try {
        const response = await fetch(
            `${process.env.apiHost}/v1/generation/${process.env.engineId}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.apiKey}`,
                },
                body: JSON.stringify({
                    text_prompts: [
                        {
                            text: req.body.text,
                        },
                    ],
                    cfg_scale: 7,
                    clip_guidance_preset: 'FAST_BLUE',
                    height: 512,
                    width: 512,
                    style_preset: 'enhance',
                    samples: 1,
                    steps: 30,
                }),
            }
        );  
        
        if(!response.ok) {
            throw new Error(`Non-200 respone: ${await response.text()}`);
        }

        const { artifacts } = await response.json();

        artifacts.forEach((image, index) => {
            fs.writeFileSync(
                `${req.body.text}.png`,
                Buffer.from(image.base64, 'base64')
            );
        });

        res.status(200).json({message: 'Image generated successfully'});
        console.log('Image generated Successfully');
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

router.post('/generative-images', upload.single("init_image"), async (req, res) => {
    try {
        const {text}  = req.body;
        
        console.log(req.file);
        const formData = new FormData();
      formData.append('init_image', fs.readFileSync(req.file.path));
      formData.append('init_image_mode', 'IMAGE_STRENGTH');
      formData.append('image_strength', 0.35);
      formData.append('text_prompts[0][text]', text);
      formData.append('cfg_scale', 7);
      formData.append('clip_guidance_preset', 'FAST_BLUE');
      formData.append('samples', 4);
      formData.append('style_preset', 'enhance');
      formData.append('steps', 30);
    
        const response = await fetch(`${process.env.apiHost}/v1/generation/${process.env.engineId}/image-to-image`, {
          method: 'POST',
          headers: {
            ...formData.getHeaders(),
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.apiKey}`,
          },
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error(`Non-200 response: ${response.statusText}`);
        }
    
        const responseJSON = await response.json();
    
        responseJSON.artifacts.forEach((image, index) => {
          fs.writeFileSync(`../out/${req.body.text}.png`, Buffer.from(image.base64, 'base64'));
        });
    
        res.status(200).json({ message: 'Images generated successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
})
// define reset password route
router.post('/reset-password', (req, res) => {
    const {old_password, new_password} = req.body;
    res.send('reset password')
})

module.exports = router;