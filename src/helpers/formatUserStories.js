export const formatUserStories = (user) => {
    if (user?.stories && user?.stories.length > 0) {
      const formattedStories = user.stories.map((story) => {
        const createdAtDate = new Date(story.createdAt);
        const currentDate = new Date();
        const timeDifference = currentDate - createdAtDate;
        const secondsElapsed = Math.floor(timeDifference / 1000);
        let subheading;
  
        if (secondsElapsed < 60) {
          subheading = `${secondsElapsed}s ago`;
        } else if (secondsElapsed < 3600) {
          subheading = `${Math.floor(secondsElapsed / 60)}m ago`;
        } else {
          subheading = `${Math.floor(secondsElapsed / 3600)}h ago`;
        }
  
        return {
          url: `${process.env.REACT_APP_API_BASE_URL}/images/${story.image}`,
          duration: 2000,
          viewers: story.viewers,
          storyId: story._id,
          header: {
            heading: user.name,
            subheading: subheading,
            profileImage: user?.profilePicture
              ? `${process.env.REACT_APP_API_BASE_URL}/images/${user?.profilePicture}`
              : "https://www.newheightschurch.com/sites/default/files/default_images/default-team-member.png",
          },
        };
      });
  
      return formattedStories;
    }
  
    return [];
  };
  