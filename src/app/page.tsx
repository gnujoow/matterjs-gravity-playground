"use client";

import React, { useEffect, useRef } from "react";
import { Engine, Render, Runner, World, Bodies, Composite } from "matter-js";
import Matter from "matter-js";

import blackSpaceShipImg from "../img/spaceship_black.png";

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

    let render = Render.create({
      element: containerRef.current === null ? undefined : containerRef.current,
      canvas: canvasRef.current === null ? undefined : canvasRef.current,
      engine: engine,
      options: {
        width:
          containerRef.current === null
            ? 600
            : containerRef.current.clientWidth,
        height:
          containerRef.current === null
            ? 600
            : containerRef.current.clientHeight,
        background: "white",
        wireframes: false,
      },
    });

    const stack = Composites.stack(
      0,
      200 - 75 - 18 * 75,
      100,
      300,
      0,
      0,
      function (x: number, y: number) {
        return Bodies.rectangle(x, y, 76, 76, {
          angle: Math.PI * (x / 76),
          render: {
            sprite: {
              texture: blackSpaceShipImg.src,
              xScale: 0.9,
              yScale: 0.9,
            },
          },
        });
      }
    );

    Composite.add(engine.world, [stack]);

    World.add(engine.world, []);
    Matter.Runner.run(engine);
    Render.run(render);
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
