import {Button} from "@app/components/ui/button";
import { Input } from "@app/components/ui/input"
import {Textarea} from "@app/components/ui/textarea";

export default function UploadStudio() {
    return (
        <div className="flex justify-center items-center  w-full h-[100vh]">
            <div className="flex flex-col w-[500px]">
                <h1 className="text-center text-3xl mb-5">Update Studio</h1>
                <Input placeholder="Title" className="mb-5"/>
                <Textarea placeholder="Description" className="mb-5" />
                <label htmlFor="picture">Thumbnail</label>
                <Input type="file"  placeholder="Filfde" className="mb-5" />
                <label htmlFor="picture">File Video</label>
                <Input type="file" placeholder="Filfde" className="mb-5" />
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Button>Save</Button>
                    <Button>Cancel</Button>
                </div>
            </div>
        </div>

    )
}