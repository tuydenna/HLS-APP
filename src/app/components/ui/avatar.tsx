"use client"

import {JSX} from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@app/lib/utils"
import {getImageProxyAPI} from "@util/helper";

function AvatarUI({src, fallbackName, widthClass="w-12", heightClass="h-12"}: {src: string | undefined, fallbackName: string | undefined, widthClass?: string , heightClass?: string}): JSX.Element {
    if (src) {
        return (
            <Avatar className={cn("border-4 border-muted", widthClass, heightClass)}>
                <AvatarImage src={getImageProxyAPI(src!)}  alt={process.env.NEXT_PUBLIC_APP_NAME} className="object-cover object-center"/>
                <AvatarFallback
                    className="bg-violet-500">{fallbackName?.charAt(0) ?? "N/A"}</AvatarFallback>
            </Avatar>
        )
    }
    return (
        <Avatar className={cn("border-4 border-muted", widthClass, heightClass)}>
            <AvatarFallback
                className="bg-violet-500">{fallbackName?.charAt(0) ?? "N/A"}</AvatarFallback>
        </Avatar>
    )
}

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export {  AvatarUI }
