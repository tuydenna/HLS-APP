import Link from "next/link";
import Image from "next/image";
import {getPosts} from "@app/services/post-api";
import { Key } from "react";

export default async function Content() {
    const posts = await getPosts()
    console.log(posts);
    return (
        <div className="videos">
            <h1>Recommended</h1>
            <div className="videos__container">
                {
                    posts?.map((post: { id: Key | null | undefined; thumbnail: string; title: string; }) => {
                        return (
                            <div className="video" key={post.id}>
                                <div className="video__thumbnail">
                                    <Link href={`/display/${post.id}`}>
                                        <Image src={`http://localhost:3080${post.thumbnail}`} alt={post.title} width={200} height={100}/>
                                    </Link>
                                </div>
                                <div className="video__details">
                                    <div className="author">
                                        <Image src="http://aninex.com/images/srvc/web_de_icon.png" alt="" width={200} height={100}/>
                                    </div>
                                    <div className="title">
                                        <h3>Build A Password Generator with React JS - Beginners Tutorial</h3>
                                        <a href="">FutureCoders</a>
                                        <span>10M Views • 3 Months Ago</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="video">
                    <div className="video__thumbnail">
                        <a href="/watch-videos/<%= data[i].id %>">
                            <img src="<%= data[i].thumbnail %>" alt="<%= data[i].title %>"/>
                        </a>
                    </div>
                    <div className="video__details">
                        <div className="author">
                            <img src="http://aninex.com/images/srvc/web_de_icon.png" alt=""/>
                        </div>
                        <div className="title">
                            <h3>
                            </h3>
                            <a href=""></a>
                            <span>10M Views • 3 Months Ago</span>
                        </div>
                    </div>
                </div>

                <div className="video">
                    <div className="video__thumbnail">
                        <Link href={"/display"}>
                            <img src="https://img.youtube.com/vi/YpTmcCBBdTE/maxresdefault.jpg" alt=""/>
                        </Link>
                    </div>
                    <div className="video__details">
                        <div className="author">
                            <img src="http://aninex.com/images/srvc/web_de_icon.png" alt=""/>
                        </div>
                        <div className="title">
                            <h3>Build A Password Generator with React JS - Beginners Tutorial</h3>
                            <a href="">FutureCoders</a>
                            <span>10M Views • 3 Months Ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}