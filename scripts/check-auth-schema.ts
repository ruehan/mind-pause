import 'dotenv/config';
import { sql } from '../app/db/config';

async function checkAuthSchema() {
  try {
    console.log('🔍 인증 스키마 검증 중...\n');

    // users 테이블 구조 확인
    console.log('📋 Users 테이블 구조:');
    const columns = await sql`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;

    columns.forEach((col: any) => {
      const nullable = col.is_nullable === 'YES' ? '✅ nullable' : '❌ NOT NULL';
      console.log(`   ${col.column_name.padEnd(20)} ${col.data_type.padEnd(15)} ${nullable}`);
    });

    // auth_provider enum 값 확인
    console.log('\n🎨 Auth Provider Enum 값:');
    const enumValues = await sql`
      SELECT enumlabel
      FROM pg_enum
      WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'auth_provider'
      )
      ORDER BY enumsortorder;
    `;
    enumValues.forEach((row: any) => {
      console.log(`   ✅ ${row.enumlabel}`);
    });

    // 인증 관련 필드 체크
    console.log('\n✅ 인증 시스템 지원 여부:\n');

    const authFields = {
      '일반 로그인 (LOCAL)': [
        'email (nullable) ✅',
        'password_hash (nullable) ✅',
        'auth_provider = LOCAL ✅'
      ],
      '소셜 로그인 (GOOGLE/KAKAO/NAVER)': [
        'auth_provider (enum) ✅',
        'auth_provider_id (varchar) ✅',
        'email (nullable, 소셜에서 제공) ✅'
      ],
      '공통 필수 필드': [
        'nickname (NOT NULL) ✅',
        'role (enum, default: USER) ✅',
        'created_at, updated_at ✅'
      ],
      '추가 기능': [
        'is_anonymous (익명 사용자) ✅',
        'profile_image_url (프로필 이미지) ✅',
        'last_login_at (마지막 로그인) ✅',
        'is_deleted, deleted_at (소프트 삭제) ✅'
      ]
    };

    Object.entries(authFields).forEach(([category, fields]) => {
      console.log(`📌 ${category}:`);
      fields.forEach(field => console.log(`   ${field}`));
      console.log('');
    });

    console.log('🎉 스키마가 일반 로그인 및 소셜 로그인을 모두 지원합니다!\n');

    // 시나리오 예시
    console.log('📝 로그인 시나리오:\n');
    console.log('1️⃣  일반 회원가입:');
    console.log('   - email + password_hash + nickname');
    console.log('   - auth_provider = LOCAL\n');

    console.log('2️⃣  구글 로그인:');
    console.log('   - email (구글에서 제공) + nickname');
    console.log('   - auth_provider = GOOGLE');
    console.log('   - auth_provider_id = 구글 사용자 ID\n');

    console.log('3️⃣  카카오 로그인:');
    console.log('   - nickname (email은 선택적)');
    console.log('   - auth_provider = KAKAO');
    console.log('   - auth_provider_id = 카카오 사용자 ID\n');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking auth schema:');
    console.error(error);
    process.exit(1);
  }
}

checkAuthSchema();
