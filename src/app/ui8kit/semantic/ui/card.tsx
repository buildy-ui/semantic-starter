import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div

      className={cn("card",

      className
      )}
      {...props} />);


}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div

      className={cn("card-header",

      className
      )}
      {...props} />);


}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3

      className={cn("card-title", className)}
      {...props} />);


}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div

      className={cn("card-description", className)}
      {...props} />);


}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div

      className={cn("card-action",

      className
      )}
      {...props} />);


}

function CardMeta({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div

      className={cn("card-meta",

      className
      )}
      {...props} />);


}

function CardFigure({
  className,
  ...props
}: React.ComponentProps<"figure">) {
  return (
    <figure

      className={cn("card-figure",

      className
      )}
      {...props} />);


}

function CardImage({
  className,
  ...props
}: React.ComponentProps<"img">) {
  return (
    <img

      className={cn("card-image",

      className
      )}
      {...props} />);


}

function CardFigcaption({
  className,
  ...props
}: React.ComponentProps<"figcaption">) {
  return (
    <figcaption

      className={cn("card-figcaption",

      className
      )}
      {...props} />);


}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div

      className={cn("card-content", className)}
      {...props} />);


}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div

      className={cn("card-footer", className)}
      {...props} />);


}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardMeta,
  CardFigure,
  CardImage,
  CardFigcaption,
  CardContent };