import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.movie.createMany({
    data: [
      {
        title: "The Shawshank Redemption",
        releaseDate: new Date("1994-09-22"),
        posterUrl: "https://example.com/shawshank-poster.jpg",
        description:
          "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      },
      {
        title: "La La Land",
        releaseDate: new Date("2016-12-09"),
        posterUrl: "https://example.com/lalaland-poster.jpg",
        description:
          "A jazz pianist falls for an aspiring actress in Los Angeles.",
      },
      {
        title: "The Godfather",
        releaseDate: new Date("1972-03-24"),
        posterUrl: "https://example.com/godfather-poster.jpg",
        description:
          "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
      },
      {
        title: "Inception",
        releaseDate: new Date("2010-07-16"),
        posterUrl: "https://example.com/inception-poster.jpg",
        description:
          "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
      },
      {
        title: "The Princess Bride",
        releaseDate: new Date("1987-09-25"),
        posterUrl: "https://example.com/princessbride-poster.jpg",
        description:
          "While home sick in bed, a young boy's grandfather reads him the story of a farmboy-turned-pirate who encounters numerous obstacles.",
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        name: "Alice",
      },
      {
        name: "Bob",
      },
      {
        name: "Charlie",
      },
    ],
  });

  await prisma.rating.createMany({
    data: [
      {
        rating: 5,
        description: "Medium good",
        userId: 1,
        movieId: 1,
      },
      {
        rating: 9,
        description: "I liked it a lot",
        userId: 2,
        movieId: 1,
      },
      {
        rating: 10,
        description: "Best movie of all time",
        userId: 3,
        movieId: 1,
      },
      {
        rating: 1,
        description: "Very boring",
        userId: 1,
        movieId: 2,
      },
      {
        rating: 4,
        description: "Just not for me",
        userId: 3,
        movieId: 2,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
