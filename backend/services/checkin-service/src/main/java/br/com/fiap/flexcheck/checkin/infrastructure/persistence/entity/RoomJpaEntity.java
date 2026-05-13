package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "fc_room",
        uniqueConstraints = @UniqueConstraint(name = "uk_room", columnNames = {"hotel_id", "room_number"})
)
public class RoomJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hotel_id", nullable = false)
    private HotelJpaEntity hotel;

    @Column(name = "room_number", nullable = false, length = 20)
    private String roomNumber;

    @Column(name = "room_type", nullable = false, length = 40)
    private String roomType;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "floor_number")
    private Integer floorNumber;

    protected RoomJpaEntity() {
    }
}
