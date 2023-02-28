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
      const cppImg = image
        .greyscale()
        .getBufferAsync("image/bmp")
        .then((bmp) => {
          const buf = Uint8Array.prototype.slice.call(bmp);
          res.send(Buffer.from(buf.slice(54)));
        });
      // const cppImg = image.greyscale().contrast(1).posterize(2).dither16();
      //   return res.send(cppImg);
    })
    .catch((err) => {
      return res.send(err);
    });
};
export default handler;
