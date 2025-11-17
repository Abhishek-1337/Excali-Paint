import Room from "@/components/Room";

const Root = async ({params}: {params: Promise<{roomId: string}>}) => {
    const awaitedParams = await params;
   
    return (
        <Room roomId = {awaitedParams.roomId}/>
    );
};

export default Root;

