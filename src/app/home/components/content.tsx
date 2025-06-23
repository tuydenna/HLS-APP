import Link from "next/link";
import Image from "next/image";
import {getPosts} from "../../../services/post-api";
import {IVideoPost} from "../../../types/video-post";
import moment from "moment/moment";

export default async function Content() {
    const posts = await getPosts()
    return (
        <div className="videos">
            <h1 style={{marginBottom: 10}}>Recommended</h1>
            <div className="videos__container mt-5">
                {
                    posts?.map((post: IVideoPost) => {
                        return (
                            <div className="video" key={post.id}>
                                <div className="video__thumbnail">
                                    <Link href={`/display/${post.id}`}>
                                        <Image src={`http://localhost:3080${post.thumbnail}`} alt={post.title} width={200} height={100}/>
                                    </Link>
                                </div>
                                <div className="video__details">
                                    <div className="author" style={{minWidth:'15%'}}>
                                        <Image src="http://aninex.com/images/srvc/web_de_icon.png" alt="" width={50} height={50}/>
                                    </div>
                                    <div className="title">
                                        <h3>{post.title}</h3>
                                        <a href="">{post.author.name}</a>
                                        <span>{post.views} Views • {moment(post.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

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
                </div> <div className="video">
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
                </div> <div className="video">
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
                </div> <div className="video">
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