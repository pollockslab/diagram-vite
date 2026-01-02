
export function _DB_ERR_MSG(err) {
    switch (err?.name) {

        case 'SecurityError':
            return {
                code: 'STORAGE_BLOCKED',
                title: '브라우저 저장소에 접근할 수 없습니다',
                message:
`이 서비스는 브라우저 저장소를 사용합니다.

다음 경우에는 사용할 수 없습니다:
• 프라이빗(시크릿) 모드
• 저장소 접근이 차단된 환경

해결 방법:
1. 일반 브라우저 창으로 다시 열어주세요
2. 다른 브라우저를 사용해 주세요`,
                severity: 'fatal',
                userFixable: true
            };

        case 'QuotaExceededError':
            return {
                code: 'STORAGE_QUOTA_EXCEEDED',
                title: '저장 공간이 부족합니다',
                message:
`브라우저에 할당된 저장 공간이 가득 찼습니다.

해결 방법:
• 브라우저 저장 공간 정리
• 불필요한 사이트 데이터 삭제

정리 후 다시 시도해 주세요.`,
                severity: 'blocking',
                userFixable: true
            };

        case 'VersionError':
            return {
                code: 'DB_VERSION_CONFLICT',
                title: '데이터베이스 버전 충돌',
                message:
`다른 탭에서 이 서비스를 사용 중인 것 같습니다.

해결 방법:
• 모든 탭을 닫고 다시 열기
• 페이지 새로고침`,
                severity: 'blocking',
                reloadRecommended: true
            };

        case 'InvalidStateError':
        case 'NotFoundError':
        case 'DataError':
            return {
                code: 'INTERNAL_DB_ERROR',
                title: '내부 데이터 오류',
                message:
`데이터 처리 중 문제가 발생했습니다.

이 문제가 계속되면:
• 페이지 새로고침
• 문제가 지속되면 문의 바랍니다`,
                severity: 'fatal',
                report: true
            };

        default:
            return {
                code: 'UNKNOWN_ERROR',
                title: '알 수 없는 오류',
                message:
`예기치 못한 문제가 발생했습니다.

해결 방법:
• 페이지 새로고침
• 다른 브라우저에서 다시 시도`,
                severity: 'fatal'
            };
    }
}