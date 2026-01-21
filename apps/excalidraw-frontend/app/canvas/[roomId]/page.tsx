import Room from "@/components/Room";

const Root = async ({params}: {params: Promise<{slug: string}>}) => {
    const awaitedParams = await params;
   
    return (
        <Room slug = {awaitedParams.slug}/>
    );
};

export default Root;

