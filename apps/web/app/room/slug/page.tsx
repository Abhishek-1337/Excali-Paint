import axios from 'axios';

const getRoom = async (slug: string) => {
    let response;
    try {
        response = await axios.get(`ws://localhost:8080/room/${slug}`);
        console.log(response);
    }
    catch(err) {
        console.log(err);
    }
}

const ChatRoom = async ({
    params
}: {
    params: Promise<{slug: string}>
}) => {
    const awaitedParams = await params;
    const slug = awaitedParams.slug;

    return (
        <>
        <h2>RoomId: </h2>
        </>
    );
}