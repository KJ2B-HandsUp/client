import { RoomData, RoomList } from "../types/roomType";

export default async function fetchData(): Promise<RoomList> {
  try {
    const response = await fetch("https://choijungle.shop/testdata");
    const jsonData: RoomList = (await response.json()) as RoomList;
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
