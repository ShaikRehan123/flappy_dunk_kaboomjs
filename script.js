const name_form = document.getElementById("name_form");

let CurrentPlayerName = "";

name_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  if (name.trim() == "") {
    alert("Please enter a name");
    return;
  }
  document.body.removeChild(document.getElementById("home-screen"));
  CurrentPlayerName = name;

  kaboom();
  document.querySelector("canvas").focus();

  loadSprite("birdy", "https://img.icons8.com/plasticine/344/flappy-dunk.png");
  loadSprite(
    "bg",
    "https://res.cloudinary.com/sample1105/image/upload/v1664856634/flappy-bird/bg.png"
  );
  loadSprite(
    "pipe",
    "https://res.cloudinary.com/sample1105/image/upload/v1664856634/flappy-bird/pipe.png"
  );
  loadSound(
    "wooosh",
    "https://res.cloudinary.com/sample1105/video/upload/v1664856634/flappy-bird/wooosh.mp3"
  );
  loadSprite("coin", "./coin.png");
  loadSound("point", "./point.mp3");
  loadSound("die", "./die.mp3");

  scene("menu", () => {
    add([sprite("bg", { width: width(), height: height() })]);
    add([
      sprite("birdy"),
      scale(1),
      pos(width() / 2, height() / 2 - 250),
      origin("center"),
    ]);
    add([
      text("Flappy Dunk", 32),
      pos(width() / 2, height() / 2),
      origin("center"),
    ]);
    add([
      text("Press Space to Start", 16),
      pos(width() / 2, height() / 2 + 100),
      origin("center"),
    ]);
    keyPress("space", () => {
      go("game");
    });
  });

  scene("game", () => {
    const highestScore = localStorage.getItem("highestScore") || 0;
    let difficulty = localStorage.getItem("difficulty") || "EASY";

    const bg = add([sprite("bg", { width: width(), height: height() })]);

    // border

    add([rect(width(), 10), pos(0, 0), color(0, 0, 0), area(), solid()]);
    add([
      rect(width(), 10),
      pos(0, height() - 10),
      color(0, 0, 0),
      area(),
      solid(),
    ]);

    const birdy = add([
      sprite("birdy"),
      scale(0.2),
      pos(width() / 2 - 50, height() / 2 - 50),
      area(),
      body(),
    ]);
    let score = 0;
    const scoreText = add([
      text(`${score} - ${CurrentPlayerName}`, { size: 50 }),
      pos(10, 10),
    ]);

    const highestScorer = localStorage.getItem("highestScorer") || "No one";

    const highestScoreText = add([
      text(`Highest Score: ${highestScore} by ${highestScorer}`, { size: 30 }),
      pos(10, 80),
    ]);
    const difficultyText = add([
      text(`Difficulty: `, { size: 30 }),
      pos(10, 120),
    ]);

    const difficultyVar = add([
      text(difficulty, { size: 30 }),
      pos(220, 120),
      color(0, 0, 0),
    ]);

    // three options for difficulty
    // EASY, MEDIUM, HARD
    const easyOption = add([
      text("EASY", { size: 30 }),
      pos(10, 160),
      difficulty === "EASY" ? color(148, 148, 148) : color(89, 247, 74),
      area(),
      "easy",
    ]);

    onClick("easy", () => {
      if (difficulty !== "EASY") {
        localStorage.setItem("difficulty", "EASY");
        go("game");
      }
    });

    onHover("easy", () => {
      if (difficulty !== "EASY") {
        cursor("pointer");
      }
    });

    const mediumOption = add([
      text("MEDIUM", { size: 30 }),
      pos(10, 200),

      difficulty === "MEDIUM" ? color(148, 148, 148) : color(247, 247, 74),
      area(),
      "medium",
    ]);

    onClick("medium", () => {
      if (difficulty !== "MEDIUM") {
        localStorage.setItem("difficulty", "MEDIUM");
        go("game");
      }
    });

    onHover("medium", () => {
      if (difficulty !== "MEDIUM") {
        cursor("pointer");
      }
    });

    const hardOption = add([
      text("HARD", { size: 30 }),
      pos(10, 240),
      difficulty === "HARD" ? color(148, 148, 148) : color(247, 74, 74),
      area(),
      "hard",
    ]);

    onClick("hard", () => {
      if (difficulty !== "HARD") {
        localStorage.setItem("difficulty", "HARD");
        go("game");
      }
    });

    onHover("hard", () => {
      if (difficulty !== "HARD") {
        cursor("pointer");
      }
    });

    // resume option at bottom
    // const resumeOption = add([
    //   text("RESUME", { size: 30 }),
    //   pos(10, height() - 40),
    //   color(89, 247, 74),
    //   area(),
    //   "resume",
    // ]);

    // onClick("resume", () => {
    //   resumeGame();
    // });

    const Jump = () => {
      play("wooosh");
      birdy.jump(400);
    };

    onKeyPress("space", Jump);
    onClick(() => Jump());

    const PIPE_GAP = 200;

    function producePipes() {
      const offset = rand(-PIPE_GAP, PIPE_GAP);

      // top pipe
      add([
        sprite("pipe"),
        scale(1, 2.5),
        pos(width(), height() / 2 + offset + PIPE_GAP / 2),
        "pipe",
        area(),
      ]);

      // bottom pipe
      add([
        sprite("pipe", { flipY: true }),
        scale(1, 2.5),

        pos(width(), height() / 2 + offset - PIPE_GAP / 2),
        origin("botleft"),
        "pipe",
        area(),
      ]);

      // coin in the middle
      add([
        sprite("coin"),
        scale(0.3),
        pos(width() + 10, height() / 2 + offset - PIPE_GAP / 2 + rand(30, 180)),
        origin("center"),
        "coin",
        area(),
        { collect: false },
      ]);
    }

    birdy.collides("pipe", () => {
      // const blowAnimation = add([
      //   sprite("blow_animation"),
      //   scale(0.2),
      //   pos(height() / 2, width() / 2),
      //   origin("center"),
      // ]);

      // blowAnimation.play("blow_anim");

      if (score > highestScore) {
        localStorage.setItem("highestScore", score);
        localStorage.setItem("highestScorer", CurrentPlayerName);
      }

      play("die");

      go("gameover", score, CurrentPlayerName);
    });

    birdy.collides("coin", (c) => {
      if (!c.collect) {
        play("point");

        destroy(c);
        score++;
        scoreText.text = `${score} - ${CurrentPlayerName}`;
        c.collect = true;
      }
    });

    onHover("bg", () => {
      cursor("pointer");
    });

    let startPlay = true;

    console.log(startPlay);

    if (startPlay) {
      let loopTime = 0;
      if (difficulty === "EASY") {
        loopTime = 2;
      } else if (difficulty === "MEDIUM") {
        loopTime = 1.5;
      } else if (difficulty === "HARD") {
        loopTime = 1;
      }
      loop(loopTime, () => {
        producePipes();
      });
      onUpdate("pipe", (pipe) => {
        let speed = 300;
        if (difficulty === "EASY") {
          speed = 300;
        } else if (difficulty === "MEDIUM") {
          speed = 350;
        } else if (difficulty === "HARD") {
          speed = 600;
        }

        pipe.move(-speed, 0);
        // if birdy has passed the pipe destroy it
        if (pipe.pos.x < birdy.pos.x) {
          destroy(pipe);
        }
      });
      onUpdate("coin", (coin) => {
        let speed = 300;
        if (difficulty === "EASY") {
          speed = 300;
        } else if (difficulty === "MEDIUM") {
          speed = 350;
        } else if (difficulty === "HARD") {
          speed = 600;
        }

        coin.move(-speed, 0);

        // if birdy has passed the coin destroy it
        if (coin.pos.x < birdy.pos.x) {
          destroy(coin);
        }
      });
    }
  });

  scene("gameover", (score, CurrentPlayerName) => {
    // birdy image
    add([sprite("bg", { width: width(), height: height() })]);

    add([
      sprite("birdy"),
      scale(1),
      pos(width() / 2, height() / 2 - 250),
      origin("center"),
    ]);

    add([
      text("Game Over", { size: 50 }),
      pos(width() / 2, height() / 2 - 50),
      origin("center"),
    ]);
    add([
      text(`Score: ${score} by ${CurrentPlayerName}`, { size: 50 }),
      pos(width() / 2, height() / 2),
      origin("center"),
    ]);
    // highest score
    const highestScore = localStorage.getItem("highestScore") || 0;
    add([
      text(
        `Highest Score: ${highestScore} by ${localStorage.getItem(
          "highestScorer"
        )}`,
        { size: 50 }
      ),
      pos(width() / 2, height() / 2 + 50),
      origin("center"),
    ]);

    add([
      text("Press Space to Start", { size: 50 }),
      pos(width() / 2, height() / 2 + 130),
      origin("center"),
    ]);
    onClick(() => go("game"));
    onKeyPress("space", () => go("game"));
  });

  go("menu");
});
