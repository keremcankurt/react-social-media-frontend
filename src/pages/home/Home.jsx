import CreatePost from '../../components/createPost/CreatePost';
import Posts from '../../components/posts/Posts';
import styles from './Home.module.scss';
import {useSelector } from 'react-redux';
export default function Home() {
  const { posts} = useSelector(
    (state) => state.post
  );
  
    return (
        <div className={styles["container"]}>
            <CreatePost/>
            <Posts posts={posts} />
        </div>
    );
}
