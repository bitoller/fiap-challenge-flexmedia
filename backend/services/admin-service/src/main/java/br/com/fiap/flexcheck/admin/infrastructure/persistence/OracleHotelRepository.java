package br.com.fiap.flexcheck.admin.infrastructure.persistence;

import br.com.fiap.flexcheck.admin.application.command.UpdateHotelBrandingCommand;
import br.com.fiap.flexcheck.admin.application.command.UpdateHotelContentCommand;
import br.com.fiap.flexcheck.admin.domain.entity.HotelProfile;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import br.com.fiap.flexcheck.admin.service.result.HotelSummaryResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class OracleHotelRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public OracleHotelRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    public List<HotelSummaryResult> listHotels() {
        return jdbc.query("""
                        SELECT id, name, owner_name, active
                          FROM fc_hotel
                         ORDER BY id
                        """,
                (rs, rowNum) -> new HotelSummaryResult(
                        rs.getLong("id"),
                        rs.getString("name"),
                        fallbackOwner(rs.getString("owner_name")),
                        isActive(rs.getString("active"))
                ));
    }

    public HotelProfileResult findById(Long hotelId) {
        return toResult(loadOrCreateHotel(hotelId));
    }

    public HotelProfileResult updateBranding(Long hotelId, UpdateHotelBrandingCommand command) {
        HotelProfile current = loadOrCreateHotel(hotelId);
        jdbc.update("""
                UPDATE fc_hotel
                   SET branding_json = ?,
                       updated_at = ?
                 WHERE id = ?
                """,
                toJson(new HotelProfile.Branding(
                        command.logoUrl(),
                        command.primaryColor(),
                        command.secondaryColor(),
                        command.accentColor(),
                        command.welcomeHeadline(),
                        command.welcomeSubheadline()
                )),
                LocalDateTime.now(),
                hotelId
        );
        return toResult(loadOrCreateHotel(current.id()));
    }

    public HotelProfileResult updateContent(Long hotelId, UpdateHotelContentCommand command) {
        HotelProfile current = loadOrCreateHotel(hotelId);
        jdbc.update("""
                UPDATE fc_hotel
                   SET content_json = ?,
                       updated_at = ?
                 WHERE id = ?
                """,
                toJson(new HotelProfile.Content(
                        command.languageDefault(),
                        List.copyOf(command.supportedLanguages()),
                        command.promotions().stream()
                                .map(promotion -> new HotelProfile.Promotion(
                                        promotion.title(),
                                        promotion.description(),
                                        promotion.active(),
                                        promotion.order()
                                ))
                                .toList(),
                        List.copyOf(command.amenities()),
                        command.mapUrl(),
                        command.supportMessage()
                )),
                LocalDateTime.now(),
                hotelId
        );
        return toResult(loadOrCreateHotel(current.id()));
    }

    private HotelProfile loadOrCreateHotel(Long hotelId) {
        try {
            return jdbc.queryForObject("""
                            SELECT id,
                                   name,
                                   owner_name,
                                   timezone,
                                   checkin_time,
                                   checkout_time,
                                   early_checkin_minutes,
                                   late_checkout_minutes,
                                   active,
                                   created_at,
                                   updated_at,
                                   branding_json,
                                   content_json
                              FROM fc_hotel
                             WHERE id = ?
                            """,
                    (rs, rowNum) -> toProfile(
                            rs.getLong("id"),
                            rs.getString("name"),
                            rs.getString("owner_name"),
                            rs.getString("timezone"),
                            rs.getString("checkin_time"),
                            rs.getString("checkout_time"),
                            rs.getInt("early_checkin_minutes"),
                            rs.getInt("late_checkout_minutes"),
                            rs.getString("active"),
                            toLocalDateTime(rs.getTimestamp("created_at")),
                            toLocalDateTime(rs.getTimestamp("updated_at")),
                            rs.getString("branding_json"),
                            rs.getString("content_json")
                    ),
                    hotelId);
        } catch (EmptyResultDataAccessException ex) {
            HotelProfile fallback = DefaultHotelProfiles.findDefault(hotelId);
            insertHotel(fallback);
            return fallback;
        }
    }

    private void insertHotel(HotelProfile profile) {
        jdbc.update("""
                INSERT INTO fc_hotel (
                    id,
                    name,
                    owner_name,
                    timezone,
                    checkin_time,
                    checkout_time,
                    early_checkin_minutes,
                    late_checkout_minutes,
                    active,
                    created_at,
                    updated_at,
                    branding_json,
                    content_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                profile.id(),
                profile.name(),
                profile.ownerName(),
                profile.timezone(),
                profile.checkinTime(),
                profile.checkoutTime(),
                profile.earlyCheckinMinutes(),
                profile.lateCheckoutMinutes(),
                profile.active() ? "Y" : "N",
                profile.createdAt(),
                profile.updatedAt(),
                toJson(profile.branding()),
                toJson(profile.content())
        );
    }

    private HotelProfile toProfile(
            Long id,
            String name,
            String ownerName,
            String timezone,
            String checkinTime,
            String checkoutTime,
            int earlyCheckinMinutes,
            int lateCheckoutMinutes,
            String active,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            String brandingJson,
            String contentJson
    ) {
        HotelProfile fallback = DefaultHotelProfiles.findDefault(id);
        HotelProfile.Branding branding = parse(brandingJson, HotelProfile.Branding.class, fallback.branding());
        HotelProfile.Content content = parse(contentJson, HotelProfile.Content.class, fallback.content());
        return new HotelProfile(
                id,
                name,
                fallbackOwner(ownerName),
                timezone == null ? fallback.timezone() : timezone,
                checkinTime == null ? fallback.checkinTime() : checkinTime,
                checkoutTime == null ? fallback.checkoutTime() : checkoutTime,
                earlyCheckinMinutes == 0 ? fallback.earlyCheckinMinutes() : earlyCheckinMinutes,
                lateCheckoutMinutes == 0 ? fallback.lateCheckoutMinutes() : lateCheckoutMinutes,
                branding,
                content,
                isActive(active),
                createdAt == null ? fallback.createdAt() : createdAt,
                updatedAt == null ? fallback.updatedAt() : updatedAt
        );
    }

    private HotelProfileResult toResult(HotelProfile hotel) {
        return new HotelProfileResult(
                hotel.id(),
                hotel.name(),
                hotel.ownerName(),
                hotel.timezone(),
                hotel.checkinTime(),
                hotel.checkoutTime(),
                hotel.earlyCheckinMinutes(),
                hotel.lateCheckoutMinutes(),
                new HotelProfileResult.BrandingResult(
                        hotel.branding().logoUrl(),
                        hotel.branding().primaryColor(),
                        hotel.branding().secondaryColor(),
                        hotel.branding().accentColor(),
                        hotel.branding().welcomeHeadline(),
                        hotel.branding().welcomeSubheadline()
                ),
                new HotelProfileResult.ContentResult(
                        hotel.content().languageDefault(),
                        hotel.content().supportedLanguages(),
                        hotel.content().promotions().stream()
                                .map(promotion -> new HotelProfileResult.PromotionResult(
                                        promotion.title(),
                                        promotion.description(),
                                        promotion.active(),
                                        promotion.order()
                                ))
                                .toList(),
                        hotel.content().amenities(),
                        hotel.content().mapUrl(),
                        hotel.content().supportMessage()
                ),
                hotel.active(),
                hotel.createdAt(),
                hotel.updatedAt()
        );
    }

    private <T> T parse(String json, Class<T> type, T fallback) {
        if (json == null || json.isBlank()) {
            return fallback;
        }
        try {
            return objectMapper.readValue(json, type);
        } catch (Exception ex) {
            return fallback;
        }
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to serialize hotel configuration.", ex);
        }
    }

    private String fallbackOwner(String ownerName) {
        return ownerName == null || ownerName.isBlank() ? "FlexMedia" : ownerName;
    }

    private boolean isActive(String active) {
        return active == null || active.isBlank() || "Y".equalsIgnoreCase(active) || "TRUE".equalsIgnoreCase(active);
    }

    private LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }
}
