import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";
import Jimp from "jimp";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;
  console.log(slug);

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      error: "Missing slug, should be a string.",
    });
  }
  //https://codesandbox.io/s/suspicious-wind-p3htvj?file=/src/components/JimpDemo/JimpDemo.js
  //   const baseImage = await Jimp.read(
  //     slug.toString()
  //   );
  //   const data = await prisma.link.findFirst({
  //     where: {
  //       slug: {
  //         equals: slug,
  //       },
  //     },
  //   });
  const baseImage = await Jimp.read(
    `https://cdn.sanity.io/images/07sn9sev/production/28f52918296a22ce6e357e8c65aaa945c293817d-3092x3865.jpg?rect=1000,1050,512,128&h=32&w=128`
  )
    .then((image) => {
      image.resize(128, 32); // Resize the baseImage to 128x32
      image.greyscale().contrast(1).rgba(false);
      const cpp = image.getBufferAsync("image/bmp").then((buffer) => {
        console.log(buffer);
        const buf = Buffer.alloc(1028 + 54);

        buf.write(buffer.toString("hex"));
      });

      image.write("new-image.png");

      //   createReadStream("new-image.png")
      //     .pipe(new pngjs.PNG({}))
      //     .on("parsed", function () {
      //       for (let y = 0; y < this.height; y++) {
      //         for (let x = 0; x < this.width; x++) {
      //           let idx = (this.width * y + x) << 2;

      //           // invert color
      //           this.data[idx] = 255;

      //           // and reduce opacity
      //           this.data[idx + 3] = this.data[idx + 3] >> 1;
      //         }
      //       }

      //       this.pack().pipe(fs.createWriteStream("out.png"));
      //     });
      res.send(image.bitmap.data);
    })
    // .then((image) => {
    //   const cppImg = image
    //     .resize(128, 32)
    //     .greyscale()
    //     .contrast(1)
    //     .posterize(2)
    //     .getBufferAsync("image/bmp")
    //     .then((bmp) => {
    //       const buffer = Buffer.alloc(1028 + 54);
    //       const length = buffer.write(bmp.toString("hex"));
    //       console.log(buffer);
    //       //   const sliced = buffer.subarray(0, 512);
    //       console.log(length);
    //       //   console.log(sliced);
    //       res.send(JSON.stringify(buffer));
    //     });
    //   // const cppImg = image.greyscale().contrast(1).posterize(2).dither16();
    //   //   return res.send(cppImg);
    // })
    .catch((err) => {
      return res.send(err);
    });
};
export default handler;
