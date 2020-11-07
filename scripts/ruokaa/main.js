'use strict';

const fetch = require('node-fetch');

exports.ruokaa = async (message) => {
  message.channel.startTyping();

  try {
    const menu = await fetch(
      'https://skinfo.juho.space/categories.json'
    ).then((res) => res.json());

    const texts = [`Syödään tänään`];

    const appendMenu = (categories, header) => {
      texts.push(header);

      for (const category of categories) {
        texts.push(` - ${category.category}:`);
        for (const food of category.foods) {
          let result = `   ${food.name}`;
          if (food.dietInfo.length > 0) {
            result += ` (${food.dietInfo.join('/')})`;
          }
          texts.push(result);
        }
      }
    };

    const yolo = menu.yolo && menu.yolo.length > 0;
    const laseri = menu.laseri && menu.laseri.length > 0;

    if (!yolo && !laseri) {
      await message.channel.send('Ei ruokalistoja.');
      return;
    }

    if (yolo) {
      appendMenu(menu.yolo, `🍉 Yololla`);
    }

    if (laseri) {
      appendMenu(menu.laseri, `🍑 Laserilla`);
    }

    const mes = await message.channel.send(texts.join('\n'));
    if (yolo) {
      await mes.react('🍉');
    }
    if (laseri) {
      await mes.react('🍑');
    }
  } catch (error) {
    console.log(error);
  } finally {
    await message.channel.stopTyping();
  }
};
