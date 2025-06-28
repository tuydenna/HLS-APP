import React from "react";

const Separator = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={className + " shrink-0 bg-border h-[1px] w-full mt-2 mb-2"} {...props} />
));

export {Separator};