"use client";

import React, { useEffect, useRef } from "react";
import { Engine, Render, Runner, World, Bodies, Composite } from "matter-js";
import Matter from "matter-js";

import blackSpaceShipImg from "../img/spaceship_black.png";
import blueSpaceShipImg from "../img/spaceship_blue.png";

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Composites = Matter.Composites;
    let Bodies = Matter.Bodies;
    let engine = Engine.create({
      gravity: {
        x: 0,
        y: 0,
        scale: 0,
      },
    });

    const divHeight =
      containerRef.current === null ? 600 : containerRef.current.clientHeight;
    const divWidth =
      containerRef.current === null ? 600 : containerRef.current.clientWidth;

    let render = Render.create({
      element: containerRef.current === null ? undefined : containerRef.current,
      canvas: canvasRef.current === null ? undefined : canvasRef.current,
      engine: engine,
      options: {
        width: divWidth,
        height: divHeight,
        background: "white",
        wireframes: false,
      },
    });

    const ground = Bodies.rectangle(
      divWidth / 2, // 가운데 위치
      divHeight, // 바닥에 위치
      divWidth, // 가로 길이는 화면 너비와 같음
      10, // 높이는 10
      {
        isStatic: true, // 바닥은 움직이지 않으므로 정적으로 설정
        render: {
          fillStyle: "white", // 바닥의 색상 설정
        },
      }
    );

    const stack = Composites.stack(
      0,
      0,
      40,
      40,
      0,
      0,
      function (x: number, y: number, column: number, row: number) {
        return Bodies.rectangle(x, y, 76, 76, {
          angle: Math.PI * (x / 76),
          render: {
            sprite: {
              texture: blackSpaceShipImg.src,
              xScale: 1,
              yScale: 1,
            },
          },
        });
      }
    );

    Composite.add(engine.world, [stack, ground]);

    World.add(engine.world, []);
    Matter.Runner.run(engine);
    Render.run(render);

    setTimeout(() => {
      engine.gravity.y = 1;
      engine.gravity.scale = 0.001;
      Matter.Runner.run(engine);

      const staticBody = Bodies.rectangle(divWidth / 2, divHeight / 2, 80, 80, {
        isStatic: true, // 중력의 영향을 받지 않도록 설정
        render: {
          sprite: {
            texture: blueSpaceShipImg.src,
            xScale: 0.9,
            yScale: 0.9,
          },
        },
        collisionFilter: {
          category: 2, // 중력의 영향을 받지 않는 바디의 카테고리 설정
          mask: 0, // 충돌하지 않도록 mask 설정
        },
      });

      // 중력의 영향을 받지 않는 바디를 월드에 추가
      World.add(engine.world, staticBody);
    }, 3000);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        background: "red",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Home;
