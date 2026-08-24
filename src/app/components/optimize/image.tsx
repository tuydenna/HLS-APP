'use client';

import { JSX} from "react";
import * as Next from "next/image";

// export default function Image(props: any): JSX.Element {
//    return <img {...props} />;
// }


export default function Image(props: any): JSX.Element {
   return <Next.default {...props} loading="eager"/>;
}
