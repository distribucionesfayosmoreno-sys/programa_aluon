package com.aluon.crm.social.repository;

import com.aluon.crm.social.model.SocialMediaPublication;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SocialMediaPublicationRepository extends JpaRepository<SocialMediaPublication, UUID> {

    @Query("select distinct publication from SocialMediaPublication publication left join fetch publication.channels order by publication.updatedAt desc")
    List<SocialMediaPublication> findAllByOrderByUpdatedAtDesc();

    @EntityGraph(attributePaths = "channels")
    Optional<SocialMediaPublication> findById(UUID id);
}
