import { db } from '../config/dbconfig';

// const userQuery = `INSERT INTO user (user_id, user_name, user_password, user_nickname, verify, location_user, delete_flag, user_img) VALUES
// ('user13', '테스트', 'pwd1234', '테스트닉네임', 'user', '강서구', 0, NULL)`;

// const userQuery = `INSERT INTO user (user_id, user_name, user_password, user_nickname, verify, location_user, delete_flag, user_img) VALUES
// ('admin1', '관리자1', 'pwd4321', '운영자1', 'admin', '용산구', 0, NULL),
// ('admin2', '관리자2', 'pwd4321', '운영자2', 'admin', '중구', 0, NULL),
// ('user1', '김민철', 'pwd1234', '민철', 'user', '마포구', 0, NULL),
// ('user2', '이승연', 'pwd1234', '승연', 'user', '마포구', 0, NULL),
// ('user3', '박민지', 'pwd1234', '민지', 'user', '마포구', 0, NULL),
// ('user4', '최민수', 'pwd1234', '민수', 'user', '서초구', 0, NULL),
// ('user5', '한영호', 'pwd1234', '영호', 'user', '서초구', 0, NULL),
// ('user6', '장지원', 'pwd1234', '지원', 'user', '서초구', 0, NULL),
// ('user7', '윤지은', 'pwd1234', '지은', 'user', '종로구', 0, NULL),
// ('user8', '성유진', 'pwd1234', '유진', 'user', '종로구', 0, NULL),
// ('user9', '양은지', 'pwd1234', '은지', 'user', '종로구', 0, NULL),
// ('user10', '유준형', 'pwd1234', '준형', 'user', '성동구', 0, NULL),
// ('user11', '임지훈', 'pwd1234', '지훈', 'user', '성동구', 0, NULL),
// ('user12', '송기훈', 'pwd1234', '기훈', 'user', '성동구', 0, NULL);`;

const reviewQuery = `INSERT INTO review (review_id, location_id, location_name, location_category, user_id, review_content, star_rating, created_at) VALUES 
(DEFAULT, '1234', '강아지나라', '병원', 'user1', '진료가 친절해서 좋았습니다.', 4.3, DEFAULT),
(DEFAULT, '5678', '푸들하우스', '미용실', 'user10', '강아지 털이 깔끔하게 잘라줬어요!', 4, DEFAULT),
(DEFAULT, '2468', '멍멍애견용품', '애견용품점', 'user11', '다양한 애견용품이 있어서 좋았어요!', 4.5, DEFAULT),
(DEFAULT, '1357', '댕댕스테이션', '카페', 'user12', '강아지랑 함께 커피한잔 하기에 딱 좋은 곳이에요!', 4, DEFAULT),
(DEFAULT, '3691', '우리강아지공원', '공원', 'user2', '강아지와 함께 산책하기 좋은 장소입니다!', 4.5, DEFAULT),
(DEFAULT, '7894', '애니멀병원', '병원', 'user3', '진료하는 동물병원 중에 가격이 저렴한 곳입니다.', 3.5, DEFAULT),
(DEFAULT, '9512', '왈왈애견미용실', '미용실', 'user4', '토이푸들 털이 예뻐서 다음에도 방문할 예정입니다!', 4.7, DEFAULT),
(DEFAULT, '7539', '행복한강아지', '애견용품점', 'user5', '애견음식이 너무 풍부합니다.', 4.2, DEFAULT),
(DEFAULT, '6541', '좋은애견카페', '카페', 'user6', '펫플레이트를 먹어보았는데, 강아지가 정말 좋아했습니다.', 4.5, DEFAULT),
(DEFAULT, '7953', '멍멍놀이터', '공원', 'user7', '좋은 날씨에 강아지와 산책하기에 딱 좋은 공원입니다.', 4.2, DEFAULT);`;

const postQuery = `INSERT INTO post (post_id, user_id, post_category, post_title, post_content, post_img, comment_id, delete_flag, created_at) VALUES
(DEFAULT, 'user1', '일상', '반려견과 함께하는 달콤한 일상', '반려견과 함께하는 달콤한 일상을 즐겨봅시다.', null, null, 0, DEFAULT),
(DEFAULT, 'user2', '일상', '강아지를 위한 꿀팁', '강아지를 키우면서 도움이 되는 꿀팁을 알려드립니다.', null, null, 0, DEFAULT),
(DEFAULT, 'user3', '일상', '강아지 용품 사용법', '강아지 용품의 사용법을 제대로 알아봅시다.', null, null, 0, DEFAULT),
(DEFAULT, 'user4', '일상', '강아지와 함께하는 가을 나들이', '강아지와 함께하는 가을 나들이 코스를 소개합니다.', null, null, 0, DEFAULT),
(DEFAULT, 'user5', '일상', '강아지의 건강을 지켜주는 예방접종', '강아지의 건강을 지키기 위한 예방접종에 대해 알아봅시다.', null, null, 0, DEFAULT),
(DEFAULT, 'user6', '일상', '려견과 함께하는 겨울 레저 활동', '반려견과 함께하는 겨울 레저 활동을 즐길 수 있는 방법을 알아봅시다.', null, null, 0, DEFAULT),
(DEFAULT, 'user7', '정보공유', '강아지의 건강한 식습관을 유지하는 방법', '강아지의 건강을 지키기 위한 올바른 식습관을 유지하는 방법을 알아봅시다.', null, null, 0, DEFAULT),
(DEFAULT, 'user8', '정보공유', '강아지 교육의 기본, 시간과 인내', '강아지 교육에서 가장 중요한 것은 시간과 인내입니다.', null, null, 0, DEFAULT),
(DEFAULT, 'user9', '정보공유', '반려견을 위한 건강한 야외생활', '반려견이 건강하게 야외생활을 즐길 수 있도록 주의할 점을 알아봅시다.', null, null, 0, DEFAULT),
(DEFAULT, 'user10', '정보공유', '강아지와 함께하는 여름 레저 활동', '강아지와 함께하는 여름 레저 활동을 즐길 수 있는 방법을 알아봅시다.', null, null, 0, DEFAULT),
(DEFAULT, 'user11', '정보공유', '강아지가 좋아하는 스낵 추천', '강아지가 좋아하는 스낵을 소개합니다.', null, null, 0, DEFAULT),
(DEFAULT, 'user12', '정보공유', '강아지의 스트레스 해소법', '강아지의 스트레스를 해소할 수 있는 방법을 알아봅시다.', null, null, 0, DEFAULT);`;

const petQuery = `INSERT INTO pet (pet_id, pet_name, user_id) VALUES
(DEFAULT, '초코', 'user1'),
(DEFAULT, '감자', 'user2'),
(DEFAULT, '쿠키', 'user3'),
(DEFAULT, '해피', 'user4'),
(DEFAULT, '체리', 'user5'),
(DEFAULT, '루나', 'user6'),
(DEFAULT, '블루', 'user7'),
(DEFAULT, '베리', 'user8'),
(DEFAULT, '코코', 'user9'),
(DEFAULT, '무지', 'user10'),
(DEFAULT, '프로도', 'user11'),
(DEFAULT, '피치', 'user12');`;

const commentQuery = `INSERT INTO comment (comment_id, user_id, comment_content, created_at) VALUES 
(DEFAULT, 'user1', '좋은 정보 감사합니다.', DEFAULT),
(DEFAULT, 'user2', '강아지와 함께하는 일상이 너무 좋아요!', DEFAULT),
(DEFAULT, 'user3', '강아지 교육에 대한 내용도 알차게 쓰셨네요.', DEFAULT),
(DEFAULT, 'user4', '강아지 용품 사용법에 대해 자세히 알려주셔서 감사합니다.', DEFAULT),
(DEFAULT, 'user5', '강아지와 함께하는 가을 나들이 추천 감사합니다!', DEFAULT),
(DEFAULT, 'user6', '강아지 건강에 대한 정보 공유 감사합니다.', DEFAULT),
(DEFAULT, 'user7', '강아지 스트레스 해소 방법에 대해 알려주셔서 감사합니다.', DEFAULT),
(DEFAULT, 'user8', '강아지를 키우면서 도움이 되는 꿀팁 감사합니다.', DEFAULT),
(DEFAULT, 'user9', '강아지와 함께하는 달콤한 일상이 너무 좋아요!', DEFAULT),
(DEFAULT, 'user10', '강아지의 건강을 지켜주는 예방접종에 대한 정보 감사합니다.', DEFAULT),
(DEFAULT, 'user11', '강아지와 함께하는 여름 레저 활동 추천 감사합니다!', DEFAULT),
(DEFAULT, 'user12', '강아지가 좋아하는 스낵 추천 감사합니다.', DEFAULT);`;

// const insertDummyUsers = async () => {
//   try {
//     await db.query('DELETE FROM user');
//     const [result, _]: any = await db.query(userQuery);
//     console.log('Success inserting dummy Users!, Insert Info: ', result.info);
//   } catch (error) {
//     console.log('Error inserting dummy Users: ', error);
//   }
// };

const insertDummyReviews = async () => {
  try {
    await db.query('DELETE FROM review');
    await db.query('ALTER TABLE review AUTO_INCREMENT = 1'); // 더미데이터 초기회할때는 AI 1부터 다시 시작
    const [result, _]: any = await db.query(reviewQuery);
    console.log('Success inserting dummy Reviews!, Insert Info: ', result.info);
  } catch (error) {
    console.log('Error inserting dummy Reviews: ', error);
  }
};

const insertDummyPosts = async () => {
  try {
    await db.query('DELETE FROM post');
    await db.query('ALTER TABLE post AUTO_INCREMENT = 1'); // 더미데이터 초기회할때는 AI 1부터 다시 시작
    const [result, _]: any = await db.query(postQuery);
    console.log('Success inserting dummy Posts!, Insert Info: ', result.info);
  } catch (error) {
    console.log('Error inserting dummy Posts: ', error);
  }
};

const insertDummyPets = async () => {
  try {
    await db.query('DELETE FROM pet');
    await db.query('ALTER TABLE pet AUTO_INCREMENT = 1'); // 더미데이터 초기회할때는 AI 1부터 다시 시작
    const [result, _]: any = await db.query(petQuery);
    console.log('Success inserting dummy Pets!, Insert Info: ', result.info);
  } catch (error) {
    console.log('Error inserting dummy Pets: ', error);
  }
};

const insertDummyComments = async () => {
  try {
    await db.query('DELETE FROM comment');
    await db.query('ALTER TABLE comment AUTO_INCREMENT = 1'); // 더미데이터 초기회할때는 AI 1부터 다시 시작
    const [result, _]: any = await db.query(commentQuery);
    console.log('Success inserting dummy Comments!, Insert Info: ', result.info);
  } catch (error) {
    console.log('Error inserting dummy Comments: ', error);
  }
};

export {
  // insertDummyUsers,
  insertDummyReviews,
  insertDummyPosts,
  insertDummyPets,
  insertDummyComments,
};
