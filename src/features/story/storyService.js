
import { del, post} from '../request';
const BASE_URL = "http://localhost:4000/api/story";

const addStory = story_image => post(`${BASE_URL}/add`,story_image);
const addStoryViewer = id => post(`${BASE_URL}/${id}/viewers`);
const deleteStory = id => del(`${BASE_URL}/${id}`);

const storyService = {
    addStory,
    deleteStory,
    addStoryViewer
}

export default storyService;